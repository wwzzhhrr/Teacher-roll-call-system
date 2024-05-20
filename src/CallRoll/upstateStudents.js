export function upstateStudents(url, change) {
    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(change), // 将 points 设置为一个数值
    })
}