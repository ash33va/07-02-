import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './ProductTable.css'; // Импортируем файл с стилями

const PageSize = 20; // Количество элементов на одной странице

function ProductTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Загружаем данные
  useEffect(() => {
    axios.get('https://dummyjson.com/products?limit=10000')
      .then(response => {
        setData(response.data.products); // Сохраняем товары в state
      })
      .catch(error => {
        console.error("Ошибка при загрузке данных:", error);
      });
  }, []);

  // Мемоизация отображаемых данных с пагинацией
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PageSize;
    const endIndex = startIndex + PageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  // Количество страниц
  const totalPages = Math.ceil(data.length / PageSize);

  // Обработчик переключения страницы
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="product-table-container">
      <h1 className="table-title">Таблица товаров</h1>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация */}
      <div className="pagination">
        <button 
          className="pagination-button" 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage <= 1}>
          Предыдущая
        </button>

        {/* Отображение номера текущей страницы */}
        <span className="pagination-info">
          Страница {currentPage} из {totalPages}
        </span>

        <button 
          className="pagination-button" 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage >= totalPages}>
          Следующая
        </button>
      </div>
    </div>
  );
}

export default ProductTable;
