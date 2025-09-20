import React from 'react';

export default function Pagination({ page, total, limit, onChange }){
  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));
  const pages = [];
  
  // Show only a few pages around current page
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);
  
  for(let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="pagination">
      <button 
        onClick={()=>onChange(Math.max(1, page-1))} 
        disabled={page <= 1}
        title="Previous page"
      >
        ← Prev
      </button>
      
      {startPage > 1 && (
        <>
          <button onClick={()=>onChange(1)}>1</button>
          {startPage > 2 && <span>...</span>}
        </>
      )}
      
      {pages.map(p => (
        <button 
          key={p} 
          onClick={()=>onChange(p)} 
          className={p === page ? 'active' : ''}
          title={`Go to page ${p}`}
        >
          {p}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span>...</span>}
          <button onClick={()=>onChange(totalPages)}>{totalPages}</button>
        </>
      )}
      
      <button 
        onClick={()=>onChange(Math.min(totalPages, page+1))} 
        disabled={page >= totalPages}
        title="Next page"
      >
        Next →
      </button>
    </div>
  );
}
