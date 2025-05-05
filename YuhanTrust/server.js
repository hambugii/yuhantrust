const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const keys = require('./credentials.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // public 폴더에 있는 정적 파일 서빙

// 🔒 2. 서비스 계정 인증 설정
const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// 📡 3. matrix 요청 처리
app.post('/api/matrix', async (req, res) => {
  console.log("📥 POST 요청 수신됨");

  const { sheetUrl, semester } = req.body;
  console.log(`➡️ 입력된 URL: ${sheetUrl}`);
  console.log(`➡️ 선택된 학기: ${semester}`);

  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);


  if (!match) {
    console.log("❌ 유효하지 않은 시트 URL");
    return res.status(400).json({ success: false, message: '유효하지 않은 시트 URL입니다.' });
  }

  const sheetId = match[1];
  console.log(`✅ 추출된 시트 ID: ${sheetId}`);

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${semester}!A1:D`,
    });

    console.log("✅ 시트 데이터 받아옴");
    res.json({ success: true, data: response.data.values });
  } catch (error) {
    console.error('❌ 시트 조회 실패:', error.message);
    res.status(500).json({ success: false, message: '조회 실패', detail: error.message });
  }
});

// ✅ 4. 서버 실행 로그
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});
