import ReactPaginate from "react-paginate";
import "./Pagination.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
const Pagination = ({ pageCount, onPress }) => {
  const handlePageClick = (data: { selected: number }) => {
    onPress(data.selected + 1);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=<ChevronLeft />
      previousLabel=<ChevronRight />
      onPageChange={handlePageClick}
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      containerClassName="pagination"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      activeClassName="active"
      disabledClassName="disabled"
    />
  );
};

export default Pagination;
