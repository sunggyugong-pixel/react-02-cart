import React, { useState } from 'react';

function App() {
  const [items, setItems] = useState([
    { id: 1, name: '지우개', quantity: 1 },
    { id: 2, name: '공책', quantity: 1 },
  ]);
  const [inputName, setInputName] = useState('');

  // 최근 삭제된 상품을 담아둘 상태 (단일 객체 또는 배열)
  const [deletedItem, setDeletedItem] = useState(null);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setItems([...items, { id: Date.now(), name: inputName, quantity: 1 }]);
    setInputName('');
  };

  const handleQuantityChange = (id, delta) => {
    setItems(
        items.map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty < 0 ? 0 : newQty };
          }
          return item;
        })
    );
  };

  // 삭제 시, 삭제된 상품을 백업해 둠
  const handleDeleteItem = (id) => {
    const targetItem = items.find(item => item.id === id);
    setDeletedItem(targetItem); // 복구를 위해 백업
    setItems(items.filter((item) => item.id !== id));
  };

  // 삭제 취소 / 복구 함수
  const handleRestore = () => {
    if (!deletedItem) return;
    setItems([...items, deletedItem]); // 다시 목록에 추가
    setDeletedItem(null); // 백업 초기화
  };

  const totalItemsCount = items.length;
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>🛒 Simple Shop</h1>

        <fieldset style={{ marginBottom: '20px', padding: '10px' }}>
          <legend>상품 추가</legend>
          <form onSubmit={handleAddItem}>
            <input
                type="text"
                placeholder="상품명을 입력하세요"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                style={{ marginRight: '8px' }}
            />
            <button type="submit">카트에 담기</button>
          </form>
        </fieldset>

        {/* 최근 삭제된 상품이 있을 때만 복구 버튼 표시 */}
        {deletedItem && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba' }}>
              <span>[{deletedItem.name}] 상품이 삭제되었습니다. </span>
              <button onClick={handleRestore} style={{ marginLeft: '10px' }}>되돌리기 (복구)</button>
            </div>
        )}

        {items.length === 0 ? (
            <p style={{ color: '#888', margin: '20px 0' }}>장바구니에 담긴 상품이 없습니다.</p>
        ) : (
            <table
                border="1"
                cellPadding="8"
                cellSpacing="0"
                style={{ width: '100%', textAlign: 'center', marginBottom: '20px', borderCollapse: 'collapse' }}
            >
              <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <th style={{ width: '33.3%' }}>상품명</th>
                <th style={{ width: '33.3%' }}>수량 제어</th>
                <th style={{ width: '33.3%' }}>관리</th>
              </tr>
              </thead>
              <tbody>
              {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                      <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteItem(item.id)}>삭제</button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}

        <h3>
          총 품목 : {totalItemsCount}개 / 총 수량 : {totalQuantity}개
        </h3>
      </div>
  );
}

export default App;