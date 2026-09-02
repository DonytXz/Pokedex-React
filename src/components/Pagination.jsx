import React from "react";
import ArrowNext from "../assets/icons/arrow-next.svg";
import ArrowPrev from "../assets/icons/arrow-prev.svg";

const Pagination = (props) => {
  const {
    onLeftClick,
    onRightClick,
    firstPage,
    secondPage,
    underLatsPage,
    lastPage,
    page,
    searched,
    total,
  } = props;
  const isFirstPage = page <= 0;
  const isLastPage = page >= total - 1;

  return (
    <nav aria-label="Pagination" className="w-full max-w-lg mx-auto flex flex-row justify-center py-6">
      <div className="flex items-center gap-1 font-medium">
        <button
          type="button"
          onClick={onLeftClick}
          disabled={isFirstPage}
          aria-label="Previous page"
          className="w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-md bg-white border border-gray-200 hover:bg-green-500 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-inherit disabled:cursor-not-allowed transition duration-150 ease-in focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
        >
          <img src={ArrowPrev} className="w-4 h-4" alt="" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={firstPage}
          aria-label="Page 1"
          aria-current={page === 0 ? "page" : undefined}
          className={`w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-md border transition duration-150 ease-in focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
            page === 0
              ? "bg-green-600 text-white font-bold border-green-600"
              : "bg-white text-gray-800 border-gray-200 hover:bg-green-500 hover:text-white"
          }`}
        >
          1
        </button>

        {total > 1 && (
          <button
            type="button"
            onClick={secondPage}
            aria-label="Page 2"
            aria-current={page === 1 ? "page" : undefined}
            className={`w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-md border transition duration-150 ease-in focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
              page === 1
                ? "bg-green-600 text-white font-bold border-green-600"
                : "bg-white text-gray-800 border-gray-200 hover:bg-green-500 hover:text-white"
            }`}
          >
            2
          </button>
        )}

        {total > 4 && (
          <span
            aria-hidden="true"
            className="w-8 h-10 md:w-10 md:h-12 flex justify-center items-center text-gray-500"
          >
            ...
          </span>
        )}

        {total > 3 && (
          <button
            type="button"
            onClick={underLatsPage}
            aria-label={`Page ${total - 1}`}
            aria-current={page === total - 2 ? "page" : undefined}
            className={`w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-md border transition duration-150 ease-in focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
              page === total - 2
                ? "bg-green-600 text-white font-bold border-green-600"
                : "bg-white text-gray-800 border-gray-200 hover:bg-green-500 hover:text-white"
            }`}
          >
            {total - 1}
          </button>
        )}

        {total > 2 && (
          <button
            type="button"
            onClick={lastPage}
            aria-label={`Page ${total}`}
            aria-current={page === total - 1 ? "page" : undefined}
            className={`w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-md border transition duration-150 ease-in focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
              page === total - 1
                ? "bg-green-600 text-white font-bold border-green-600"
                : "bg-white text-gray-800 border-gray-200 hover:bg-green-500 hover:text-white"
            }`}
          >
            {total}
          </button>
        )}

        <button
          type="button"
          onClick={onRightClick}
          disabled={isLastPage}
          aria-label="Next page"
          className="w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-md bg-white border border-gray-200 hover:bg-green-500 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-inherit disabled:cursor-not-allowed transition duration-150 ease-in focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
        >
          <img src={ArrowNext} className="w-4 h-4" alt="" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
