import ReactPaginate from "react-paginate";
import "./Pagination.css";
import { t } from "i18next";
const Pagination = ({ pageCount, onPress }) => {
  const handlePageClick = (data: { selected: number }) => {
    onPress(data.selected + 1);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={t("next")}
      onPageChange={handlePageClick}
      marginPagesDisplayed={1}
      pageRangeDisplayed={1}
      pageCount={pageCount}
      previousLabel={t("prev")}
      containerClassName={"pagination text flex justify-center gap-4 p-3"}
      pageClassName={"bg-white"}
      pageLinkClassName={
        "page-link block size-8 rounded border border-gray-100 text-center leading-8"
      }
      previousClassName={"page-item"}
      nextClassName={"page-item"}
      previousLinkClassName={"page-link"}
      nextLinkClassName={"page-link"}
      breakClassName={"page-item"}
      breakLinkClassName={"page-link"}
      activeClassName={"active"}
    />
  );
};

export default Pagination;
