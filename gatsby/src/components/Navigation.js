import React from 'react';

export const Navigation = ({ currentPage, numPages }) => {
  return (
    <ul className="pagination">
      <li className="page-item">
        <a href="/articles" className="page-link">
          <span>««</span>
        </a>
      </li>

      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <a href={`/articles/${currentPage - 1}`} className="page-link"><span>«</span></a>
      </li>

      {Array.from({ length: numPages }).map((_, page) => {
        return (
          <li className={`page-item ${page + 1 === currentPage ? 'active' : ''}`}>
            <a className="page-link" href={`${page === 0 ? '/articles' : `/articles/${page + 1}`}`}>{page + 1}</a>
          </li>
        )
      })}

      <li className={`page-item ${currentPage === numPages ? 'disabled' : ''}`}>
        <a href={`/articles/${currentPage + 1}`} className="page-link"><span>»</span></a>
      </li>

      <li className="page-item">
        <a href={`/articles/${numPages}`} className="page-link"><span>»»</span></a>
      </li>
    </ul>
  )
}