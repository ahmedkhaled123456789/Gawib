const ProductDetalis = () => {
  return (
    <div className="p-5 bg-white m-5 ">
      <div className="flow-root">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">ID</dt>
            <dd className="text-gray-700 sm:col-span-2">65432</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Name</dt>
            <dd className="text-gray-700 sm:col-span-2">ahmed </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Gender:</dt>
            <dd className="text-gray-700 sm:col-span-2">male</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Phone</dt>
            <dd className="text-gray-700 sm:col-span-2">019374637764</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Religion:</dt>
            <dd className="text-gray-700 sm:col-span-2"> mm</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Address</dt>
            <dd className="text-gray-700 sm:col-span-2">tanta</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">E-mail</dt>
            <dd className="text-gray-700 sm:col-span-2">ahmed@gmail.com</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProductDetalis;
