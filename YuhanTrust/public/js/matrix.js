const params = new URLSearchParams(window.location.search);
const sheetUrl = params.get('sheetUrl');

async function fetchMatrix() {
  const semester = document.getElementById("semester").value;

  if (!sheetUrl || !semester) {
    alert("시트 URL 또는 학기를 확인하세요.");
    return;
  }

  try {
    const res = await fetch('/api/matrix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetUrl, semester })
    });

    const data = await res.json();
    if (!data.success) {
      alert("조회 실패: " + data.message);
      return;
    }

    renderTable(data.data);
  } catch (err) {
    alert("에러 발생: " + err.message);
  }
}

function renderTable(rows) {
  const tbody = document.getElementById('matrixBody');
  tbody.innerHTML = ''; // 기존 내용 초기화

  rows.slice(1).forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
