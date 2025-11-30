function flashButton(btn, ok = true) {
    const original = btn.textContent;
    btn.textContent = ok ? '已复制' : '复制失败';
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
    }, 1200);
}

document.querySelectorAll('.chip .copy').forEach(btn => {
    btn.addEventListener('click', async () => {
        const text = btn.dataset.email;
        try {
            await navigator.clipboard.writeText(text);
            flashButton(btn, true);
        } catch (err) {
            console.error(err);
            flashButton(btn, false);
        }
    });
});