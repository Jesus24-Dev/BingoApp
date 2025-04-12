import { useState } from 'react';

interface CopyLinkButton {
    linkToCopy: string
    loadNewCard: () => void;
}

const CopyLinkButton = ({ linkToCopy, loadNewCard }: CopyLinkButton ) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(linkToCopy)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset después de 2 segundos
      })
      .catch(err => {
        console.error('Error al copiar: ', err);
        // Opcional: Mostrar mensaje de error al usuario
      });
      loadNewCard();
  };

    

  return (
    <button
      onClick={handleCopyClick}
      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
        isCopied 
          ? 'bg-green-500 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      } transition-colors`}
    >
      {isCopied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          ¡Copiado!
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          Copiar enlace de invitacion
        </>
      )}
    </button>
  );
};

export default CopyLinkButton;