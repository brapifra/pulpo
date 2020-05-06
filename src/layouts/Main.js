import React from 'react';

export default ({ children }) => {
   return <main className="c" style={{ 
     height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' 
    }}>{children}</main>
}