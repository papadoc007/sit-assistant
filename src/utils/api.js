export async function sendMessage(messages, guidedStep = null, selectedTool = null) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, guidedStep, selectedTool })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'שגיאה בשליחת ההודעה');
  }
  return res.json();
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'שגיאה בהעלאת הקובץ');
  }
  return res.json();
}
