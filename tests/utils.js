const mongoose = require('mongoose');
const {Coder, Manager, Challenge, Submission} = require("./schemas.js");

const connectDatabase = async (url) => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true });
        console.log("database connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};


async function insertDummyData() {
    try {
        // Insert coder
        const coder = await Coder.create({
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            password: '$2b$10$mzJfMFwxfldLUZJsACh9LOtdfE9LJY2CjjB4t.rDfEZD29KuSGdz6',
            score: 100,
        });

        // Insert manager
        const manager = await Manager.create({
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            password: '$2b$10$mzJfMFwxfldLUZJsACh9LOtdfE9LJY2CjjB4t.rDfEZD29KuSGdz6',
        });

        // Insert challenge 1
        const challenge1 = await Challenge.create({
            title: 'Challenge 1',
            category: 'Category 1',
            description: 'Description for Challenge 1',
            level: 'Easy',
            creator: manager._id,
            code: {
                function_name: 'challenge1Function',
                code_text: [{ text: 'function challenge1Function() { /* code here */ }', language: 'js' }],
                inputs: [],
            },
            tests: [],
        });

        // Insert challenge 2
        const challenge2 = await Challenge.create({
            title: 'Challenge 2',
            category: 'Category 2',
            description: 'Description for Challenge 2',
            level: 'Medium',
            creator: manager._id,
            code: {
                function_name: 'challenge2Function',
                code_text: [{ text: 'function challenge2Function() { /* code here */ }', language: 'js' }],
                inputs: [],
            },
            tests: [],
        });

        // Insert passed submission for challenge 1
        const passedSubmission = await Submission.create({
            coder: coder._id,
            challenge: challenge1._id,
            grade: 90,
            isPassed: true,
        });

        // Insert failed submission for challenge 2
        const failedSubmission = await Submission.create({
            coder: coder._id,
            challenge: challenge2._id,
            isPassed: false,
        });
        console.log('Dummy data inserted successfully');
    } catch (error) {
        console.error('Error inserting dummy data:', error);
        throw error
    }
}

// Remove all data function
async function removeAllData() {
    try {
        // Remove all data from each collection
        await Coder.deleteMany({});
        await Manager.deleteMany({});
        await Challenge.deleteMany({});
        await Submission.deleteMany({});

        console.log('All data removed successfully');
    } catch (error) {
        console.error('Error removing data:', error);
    }
}

module.exports = {
    removeAllData,
    insertDummyData,
    connectDatabase
}