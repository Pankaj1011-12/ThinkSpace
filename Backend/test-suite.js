import mongoose from 'mongoose';
import UserModel from './models/userSchema.js';
import PostModel from './models/postSchema.js';
import ProductModel from './models/productSchema.js';
import NotificationModel from './models/notificationSchema.js';
import TaskModel from './models/taskSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const BASE_URL = 'http://localhost:3000/api';

async function runTestSuite() {
    console.log('========================================================');
    console.log('   STARTING THINKSPACE FULL END-TO-END AUTOMATED TESTS   ');
    console.log('========================================================\n');

    let passedTests = 0;
    let failedTests = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`  [PASS] ${message}`);
            passedTests++;
        } else {
            console.error(`  [FAIL] ${message}`);
            failedTests++;
        }
    }

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/thinkspace');
        console.log('Connected to MongoDB test database.\n');

        // Clean up any previous test accounts
        await UserModel.deleteMany({ email: { $in: ['test_usera@thinkspace.com', 'test_userb@thinkspace.com'] } });

        // 1. Register User A
        console.log('--- TEST GROUP 1: AUTHENTICATION & MULTI-USER REGISTRATION ---');
        const regARes = await fetch(`${BASE_URL}/users/registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Demo User A',
                email: 'test_usera@thinkspace.com',
                password: 'Password123'
            })
        });
        const regAData = await regARes.json();
        assert(regARes.status === 201 && regAData.status === true, 'User A (Demo User A) registered successfully');
        const tokenA = regAData.token;
        const userAId = regAData.user._id;

        // 2. Register User B
        const regBRes = await fetch(`${BASE_URL}/users/registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Demo User B',
                email: 'test_userb@thinkspace.com',
                password: 'Password123'
            })
        });
        const regBData = await regBRes.json();
        assert(regBRes.status === 201 && regBData.status === true, 'User B (Demo User B) registered successfully');
        const tokenB = regBData.token;
        const userBId = regBData.user._id;

        // 3. Login User A
        const loginRes = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test_usera@thinkspace.com',
                password: 'Password123'
            })
        });
        const loginData = await loginRes.json();
        assert(loginRes.status === 200 && loginData.status === true, 'User A login verified');

        // 4. Create Public Post by User A
        console.log('\n--- TEST GROUP 2: POSTS & SOCIAL COMMUNITY FEED ---');
        const createPostRes = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenA}`
            },
            body: JSON.stringify({
                title: 'Introduction to Distributed Systems',
                tags: '#distributed, #systems, #engineering',
                description: 'Distributed computing is a field of computer science that studies distributed systems.',
                visibility: 'public'
            })
        });
        const postData = await createPostRes.json();
        assert(createPostRes.status === 201 && postData.status === true, 'User A created a public post');
        const publicPostId = postData.post._id;

        // 5. Create Private Post by User A
        const createPrivateRes = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenA}`
            },
            body: JSON.stringify({
                title: 'Private Study Draft',
                tags: '#draft',
                description: 'Secret notes that should not be visible in public feed.',
                visibility: 'private'
            })
        });
        const privateData = await createPrivateRes.json();
        assert(createPrivateRes.status === 201, 'User A created a private post');
        const privatePostId = privateData.post._id;

        // 6. User B discovers public feed
        const feedRes = await fetch(`${BASE_URL}/posts/feed?limit=20`, {
            headers: { 'Authorization': `Bearer ${tokenB}` }
        });
        const feedData = await feedRes.json();
        const hasUserAPublicPost = feedData.posts.some(p => p._id.toString() === publicPostId.toString());
        const hasUserAPrivatePost = feedData.posts.some(p => p._id.toString() === privatePostId.toString());
        assert(hasUserAPublicPost === true, "User B discovers User A's public post in Community Feed");
        assert(hasUserAPrivatePost === false, "User A's private post is NOT exposed in Community Feed");

        // 7. User B tries to directly open User A's private post
        const accessPrivateRes = await fetch(`${BASE_URL}/posts/${privatePostId}`, {
            headers: { 'Authorization': `Bearer ${tokenB}` }
        });
        assert(accessPrivateRes.status === 403, "User B is denied access (403) to User A's private post");

        // 8. Like / Unlike by User B
        console.log('\n--- TEST GROUP 3: LIKES, UNLIKES & NOTIFICATIONS ---');
        const likeRes1 = await fetch(`${BASE_URL}/posts/${publicPostId}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${tokenB}` }
        });
        const likeData1 = await likeRes1.json();
        assert(likeData1.liked === true && likeData1.likesCount === 1, "User B liked User A's post (likesCount = 1)");

        // Unlike
        const unlikeRes = await fetch(`${BASE_URL}/posts/${publicPostId}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${tokenB}` }
        });
        const unlikeData = await unlikeRes.json();
        assert(unlikeData.liked === false && unlikeData.likesCount === 0, "User B unliked the post (likesCount = 0)");

        // Like again
        const relikeRes = await fetch(`${BASE_URL}/posts/${publicPostId}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${tokenB}` }
        });
        const relikeData = await relikeRes.json();
        assert(relikeData.liked === true && relikeData.likesCount === 1, "User B re-liked the post (likesCount = 1)");

        // 9. Comments System
        console.log('\n--- TEST GROUP 4: COMMENTS & MODERATION PERMISSIONS ---');
        const commentRes1 = await fetch(`${BASE_URL}/posts/${publicPostId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenB}`
            },
            body: JSON.stringify({ comment: 'Super interesting topic! Great notes.' })
        });
        const commentData1 = await commentRes1.json();
        assert(commentRes1.status === 201 && commentData1.comment.commenter === 'Demo User B', "User B commented on User A's post with correct identity");
        const commentBId = commentData1.comment._id;

        // Comment validation: empty comment rejected
        const emptyCommentRes = await fetch(`${BASE_URL}/posts/${publicPostId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenB}`
            },
            body: JSON.stringify({ comment: '   ' })
        });
        assert(emptyCommentRes.status === 400, 'Empty comment properly rejected with 400 Bad Request');

        // User B edit own comment
        const editCommentRes = await fetch(`${BASE_URL}/posts/${publicPostId}/comment/${commentBId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenB}`
            },
            body: JSON.stringify({ comment: 'Super interesting topic! Updated comment.' })
        });
        assert(editCommentRes.status === 200, 'User B successfully edited their own comment');

        // Check Notifications for User A
        const notifRes = await fetch(`${BASE_URL}/notifications`, {
            headers: { 'Authorization': `Bearer ${tokenA}` }
        });
        const notifData = await notifRes.json();
        assert(notifData.notifications.length >= 2, "User A received persistent notifications for like and comment from Demo User B");

        // 10. Security & Ownership Tests
        console.log('\n--- TEST GROUP 5: SECURITY, PERMISSIONS & ACCESS CONTROL ---');
        // User B tries to delete User A's post
        const deletePostRes = await fetch(`${BASE_URL}/posts/${publicPostId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokenB}` }
        });
        assert(deletePostRes.status === 403, "User B is denied (403) from deleting User A's post");

        // User B tries to edit User A's post
        const editPostRes = await fetch(`${BASE_URL}/posts/${publicPostId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenB}`
            },
            body: JSON.stringify({ title: 'Hacked Title' })
        });
        assert(editPostRes.status === 403, "User B is denied (403) from editing User A's post");

        // User A moderates (deletes) comment on their post
        const modDeleteCommentRes = await fetch(`${BASE_URL}/posts/${publicPostId}/comment/${commentBId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokenA}` }
        });
        assert(modDeleteCommentRes.status === 200, "User A (post owner) can moderate/delete comments on their post");

        // 11. Book Marketplace Tests
        console.log('\n--- TEST GROUP 6: BOOK MARKETPLACE & PRODUCTS ---');
        // Create product directly in DB for testing
        const testBook = new ProductModel({
            title: 'Operating System Concepts (Silberschatz)',
            bookAuthor: 'Abraham Silberschatz',
            price: 550,
            condition: 'Like New',
            category: 'Computer Science',
            description: '10th edition in crisp condition. Essential for CS students.',
            contactInfo: 'Available at North Campus library',
            image: '1792600451317-images.jpg',
            authorId: userAId,
            createdAt: new Date()
        });
        const savedBook = await testBook.save();
        assert(savedBook._id !== undefined, "User A listed a textbook in the marketplace");

        // User B explores book marketplace
        const exploreBooksRes = await fetch(`${BASE_URL}/products/explore?category=Computer%20Science&condition=Like%20New`);
        const exploreBooksData = await exploreBooksRes.json();
        const foundBook = exploreBooksData.books.find(b => b._id.toString() === savedBook._id.toString());
        assert(foundBook !== undefined && foundBook.price === 550 && foundBook.seller.fullName === 'Demo User A',
            "User B browses Book Marketplace and finds User A's book with price, condition & seller info");

        // Single book details endpoint
        const singleBookRes = await fetch(`${BASE_URL}/products/${savedBook._id}`);
        const singleBookData = await singleBookRes.json();
        assert(singleBookData.status === true && singleBookData.product.condition === 'Like New',
            "Single Book Details page returns complete details and seller info");

        // User B tries to delete User A's book
        const deleteBookRes = await fetch(`${BASE_URL}/products/${savedBook._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokenB}` }
        });
        assert(deleteBookRes.status === 403, "User B is denied (403) from deleting User A's book");

        // User A edits their book
        const editBookRes = await fetch(`${BASE_URL}/products/${savedBook._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenA}`
            },
            body: JSON.stringify({ price: 499, condition: 'Good' })
        });
        const editBookData = await editBookRes.json();
        assert(editBookRes.status === 200 && editBookData.product.price === 499, "User A successfully updated book price to ₹499");

        // 12. Public User Profile Tests
        console.log('\n--- TEST GROUP 7: PUBLIC USER PROFILES ---');
        const pubProfileRes = await fetch(`${BASE_URL}/users/public/${userAId}`);
        const pubProfileData = await pubProfileRes.json();
        assert(pubProfileData.status === true && pubProfileData.user.fullName === 'Demo User A' && pubProfileData.totalPosts >= 1 && pubProfileData.totalBooks >= 1,
            "Public Profile view exposes User A's name, public posts and books to other users");

        // User A updates Bio in Settings
        const updateBioRes = await fetch(`${BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenA}`
            },
            body: JSON.stringify({ bio: 'Computer Science student & Distributed Systems enthusiast' })
        });
        const updateBioData = await updateBioRes.json();
        assert(updateBioRes.status === 200 && updateBioData.user.bio.includes('Distributed Systems'),
            "User A successfully updated profile bio");

        // Clean up test data
        await UserModel.deleteMany({ email: { $in: ['test_usera@thinkspace.com', 'test_userb@thinkspace.com'] } });
        await PostModel.deleteMany({ authorId: { $in: [userAId, userBId] } });
        await ProductModel.deleteMany({ authorId: { $in: [userAId, userBId] } });
        await NotificationModel.deleteMany({ sender: { $in: [userAId, userBId] } });

        console.log('\n========================================================');
        console.log(`   TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
        console.log('========================================================\n');

        process.exit(failedTests > 0 ? 1 : 0);
    } catch (err) {
        console.error('Test suite failed with unexpected error:', err);
        process.exit(1);
    }
}

runTestSuite();
