interface Props {
  page: number;
  totalPages: number;

  // Parent decides what should happen when page changes.
  // This component only says: "user clicked page X"
  onPageChange: (
    page:number
  ) => void;
}

function Pagination({
  page,
  totalPages,
  onPageChange
}:Props) {

  // No need to show pagination, if only one page exists.
  // Less UI = cleaner UI.
  if(totalPages<=1)
    return null;

  return (
    <div className="flex-center gap-2 mt-16">

      {/* Create buttons based on total pages.
          Example: totalPages=5 -> [1,2,3,4,5]
      */}
      {Array.from({
        length:totalPages
      }).map((_,i)=>{

        // Humans count from 1
        // Arrays count from 0
        const currentPage=i+1;

        return(
          <button
            key={currentPage}
            type="button"

            // Send selected page back to parent
            onClick={()=>onPageChange(currentPage)}

            // Highlight active page
            className={`size-9 rounded-lg text-sm font-medium transition-colors
            ${
              page===currentPage
              ? "bg-app-green text-white"
              : "bg-white text-app-text-light hover:bg-app-cream"
            }`}
          >
            {currentPage}
          </button>
        )
      })}
    </div>
  )
}

export default Pagination;
