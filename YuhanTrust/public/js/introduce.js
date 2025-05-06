function viewSheet() {
    const url = document.getElementById("sheetUrl").value.trim();
  
    //구글 시트 기본 URL 확인
    if (!url.includes("docs.google.com/spreadsheets/d/")) {
      alert("올바른 구글 시트 URL을 입력하세요.");
      return;
    }
    
    // URL 인코딩 후 matrix.html로 이동
    const encoded = encodeURIComponent(url);
    window.location.href = `matrix.html?sheetUrl=${encoded}`;
}
  