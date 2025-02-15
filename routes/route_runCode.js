const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const ExecutedCode = require("../models/runCode.js");  // DB 모델 불러오기

dotenv.config();  // 환경 변수 로드

const router = express.Router();

// OpenAI 객체 생성
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 자동 감지 코드 실행 API (DB 저장 기능 추가)
router.post("/run-code", async (req, res) => {
    const { user_id, code } = req.body;  // user_id도 받아와서 저장 가능하도록 수정

    try {
        // OpenAI: 언어 감지 요청
        const detectionResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are an AI that detects the programming language from a given code snippet. Only return the language name." },
                { role: "user", content: `Detect the programming language of this code:\n${code}` }
            ],
        });

        const detectedLanguage = detectionResponse.choices[0].message.content.trim();
        console.log("🔹 감지된 언어:", detectedLanguage);

        // OpenAI: 코드 실행 요청
        const executionResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: `You are an AI that executes ${detectedLanguage} code and returns the output.` },
                { role: "user", content: `Run this ${detectedLanguage} code and return the output:\n${code}` }
            ],
        });

        const output = executionResponse.choices[0].message.content;

        // 감지된 언어, 실행된 코드, 결과를 DB에 저장
        const executedCode = await ExecutedCode.create({
            user_id: user_id || null,  // 로그인하지 않은 유저는 null
            language_detected: detectedLanguage,  // 감지된 언어 저장
            code,
            output
        });

        res.json({ success: true, output, detectedLanguage });

    } catch (error) {
        console.error("코드 실행 오류:", error);
        res.status(500).json({ error: "OpenAI API 요청 중 오류 발생", details: error.message });
    }
});

module.exports = router;