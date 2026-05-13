import { useEffect, useMemo, useState } from "react";
import { useProductCategoriesStore } from "../store/productCategoriesStore";
import PageShell from "./PageShell";
import styles from "./Categories.module.scss";

const pageSizeOptions = [10, 20, 30];

const categoryInitialValues = {
  categoryName: "",
  status: "Active",
};

const productInitialValues = {
  productName: "",
  image: "",
  price: "",
  stock: "",
  typeOfProduct: "",
  brand: "",
  discount: "",
  warranty: "",
};

const productTypeInitialValues = {
  typeOfProduct: "",
  brand: "",
  price: "",
  discount: "",
  warranty: "",
};

const getRouteFromPath = () => {
  const [, page, categoryId, productsPath, productId] =
    window.location.pathname.split("/");

  if (page !== "categories") {
    return { categoryId: "", productId: "" };
  }

  return {
    categoryId: categoryId || "",
    productId: productsPath === "products" ? productId || "" : "",
  };
};

export default function Categories({ user }) {
  const categoryRows = useProductCategoriesStore((state) => state.categories);
  const addCategory = useProductCategoriesStore((state) => state.addCategory);
  const addProduct = useProductCategoriesStore((state) => state.addProduct);
  const addProductType = useProductCategoriesStore(
    (state) => state.addProductType,
  );
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [route, setRoute] = useState(getRouteFromPath);
  const [activeModal, setActiveModal] = useState("");
  const [categoryForm, setCategoryForm] = useState(categoryInitialValues);
  const [productForm, setProductForm] = useState(productInitialValues);
  const [productTypeForm, setProductTypeForm] = useState(
    productTypeInitialValues,
  );
  const { categoryId: selectedCategoryId, productId: selectedProductId } =
    route;
  const selectedCategory = categoryRows.find(
    (category) => category.categoryId === selectedCategoryId,
  );
  const selectedProduct = selectedCategory?.products.find(
    (product) => product.productId === selectedProductId,
  );
  const totalPages = Math.ceil(categoryRows.length / pageSize);
  const activeCategoryCount = categoryRows.filter(
    (category) => category.status === "Active",
  ).length;
  const totalProductCount = categoryRows.reduce(
    (total, category) => total + category.productCount,
    0,
  );
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = useMemo(
    () => categoryRows.slice(startIndex, startIndex + pageSize),
    [categoryRows, pageSize, startIndex],
  );

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRouteFromPath());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleCategoryClick = (categoryId) => {
    setRoute({ categoryId, productId: "" });
    window.history.pushState(null, "", `/categories/${categoryId}`);
  };

  const handleProductClick = (productId) => {
    setRoute({ categoryId: selectedCategory.categoryId, productId });
    window.history.pushState(
      null,
      "",
      `/categories/${selectedCategory.categoryId}/products/${productId}`,
    );
  };

  const handleBackToCategories = () => {
    setRoute({ categoryId: "", productId: "" });
    window.history.pushState(null, "", "/categories");
  };

  const handleBackToCategory = () => {
    setRoute({ categoryId: selectedCategory.categoryId, productId: "" });
    window.history.pushState(
      null,
      "",
      `/categories/${selectedCategory.categoryId}`,
    );
  };

  const closeModal = () => setActiveModal("");

  const handleCategoryFormChange = (event) => {
    const { name, value } = event.target;
    setCategoryForm((form) => ({ ...form, [name]: value }));
  };

  const handleProductFormChange = (event) => {
    const { name, value } = event.target;
    setProductForm((form) => ({ ...form, [name]: value }));
  };

  const handleProductTypeFormChange = (event) => {
    const { name, value } = event.target;
    setProductTypeForm((form) => ({ ...form, [name]: value }));
  };

  const handleAddCategory = (event) => {
    event.preventDefault();

    if (!categoryForm.categoryName.trim()) {
      return;
    }

    addCategory(categoryForm);
    setCategoryForm(categoryInitialValues);
    closeModal();
  };

  const handleAddProduct = (event) => {
    event.preventDefault();

    if (
      !selectedCategory ||
      !productForm.productName.trim() ||
      !productForm.typeOfProduct.trim()
    ) {
      return;
    }

    addProduct(selectedCategory.categoryId, productForm);
    setProductForm(productInitialValues);
    closeModal();
  };

  const handleAddProductType = (event) => {
    event.preventDefault();

    if (
      !selectedCategory ||
      !selectedProduct ||
      !productTypeForm.typeOfProduct.trim()
    ) {
      return;
    }

    addProductType(
      selectedCategory.categoryId,
      selectedProduct.productId,
      productTypeForm,
    );
    setProductTypeForm(productTypeInitialValues);
    closeModal();
  };

  const renderModal = () => {
    if (!activeModal) {
      return null;
    }

    return (
      <div className={styles.modalBackdrop} role="presentation">
        <div className={styles.modal} role="dialog" aria-modal="true">
          {activeModal === "category" && (
            <form onSubmit={handleAddCategory}>
              <div className={styles.modalHeader}>
                <h2>Add Category</h2>
                <button type="button" onClick={closeModal}>
                  Close
                </button>
              </div>

              <label>
                Category Name
                <input
                  name="categoryName"
                  value={categoryForm.categoryName}
                  onChange={handleCategoryFormChange}
                  required
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={categoryForm.status}
                  onChange={handleCategoryFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">Create Category</button>
              </div>
            </form>
          )}

          {activeModal === "product" && (
            <form onSubmit={handleAddProduct}>
              <div className={styles.modalHeader}>
                <h2>Add Product</h2>
                <button type="button" onClick={closeModal}>
                  Close
                </button>
              </div>

              <div className={styles.formGrid}>
                <label>
                  Product Name
                  <input
                    name="productName"
                    value={productForm.productName}
                    onChange={handleProductFormChange}
                    required
                  />
                </label>
                <label>
                  Image URL
                  <input
                    name="image"
                    value={productForm.image}
                    onChange={handleProductFormChange}
                  />
                </label>
                <label>
                  Type of Product
                  <input
                    name="typeOfProduct"
                    value={productForm.typeOfProduct}
                    onChange={handleProductFormChange}
                    required
                  />
                </label>
                <label>
                  Brand
                  <input
                    name="brand"
                    value={productForm.brand}
                    onChange={handleProductFormChange}
                  />
                </label>
                <label>
                  Price
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                  />
                </label>
                <label>
                  Stock
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                  />
                </label>
                <label>
                  Discount
                  <input
                    name="discount"
                    value={productForm.discount}
                    onChange={handleProductFormChange}
                  />
                </label>
                <label>
                  Warranty
                  <input
                    name="warranty"
                    value={productForm.warranty}
                    onChange={handleProductFormChange}
                  />
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">Create Product</button>
              </div>
            </form>
          )}

          {activeModal === "productType" && (
            <form onSubmit={handleAddProductType}>
              <div className={styles.modalHeader}>
                <h2>Add Different Product</h2>
                <button type="button" onClick={closeModal}>
                  Close
                </button>
              </div>

              <div className={styles.formGrid}>
                <label>
                  Type of Product
                  <input
                    name="typeOfProduct"
                    value={productTypeForm.typeOfProduct}
                    onChange={handleProductTypeFormChange}
                    required
                  />
                </label>
                <label>
                  Brand
                  <input
                    name="brand"
                    value={productTypeForm.brand}
                    onChange={handleProductTypeFormChange}
                  />
                </label>
                <label>
                  Price
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={productTypeForm.price}
                    onChange={handleProductTypeFormChange}
                  />
                </label>
                <label>
                  Discount
                  <input
                    name="discount"
                    value={productTypeForm.discount}
                    onChange={handleProductTypeFormChange}
                  />
                </label>
                <label>
                  Warranty
                  <input
                    name="warranty"
                    value={productTypeForm.warranty}
                    onChange={handleProductTypeFormChange}
                  />
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">Add Product Type</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  if (selectedCategory && selectedProduct) {
    return (
      <div className={styles.categoriesPage}>
        <section className={styles.detailPanel}>
          <div className={styles.detailToolbar}>
            <div>
              <span className={styles.detailKicker}>
                {selectedCategory.categoryName}
              </span>
              <h2>{selectedProduct.productName}</h2>
            </div>
            <div className={styles.toolbarActions}>
              <button type="button" onClick={() => setActiveModal("productType")}>
                Add Different Product
              </button>
              <button type="button" onClick={handleBackToCategory}>
                Back
              </button>
            </div>
          </div>

          <div className={styles.productDetail}>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.productName}
              className={styles.productImage}
            />

            <div className={styles.productInfo}>
              {/* <div className={styles.productMetrics}>
                <article>
                  <span>Product ID</span>
                  <strong>{selectedProduct.productId}</strong>
                </article>
                <article>
                  <span>Starting Price</span>
                  <strong>
                    Rs. {selectedProduct.price.toLocaleString("en-IN")}
                  </strong>
                </article>
                <article>
                  <span>Available Stock</span>
                  <strong>{selectedProduct.stock}</strong>
                </article>
              </div> */}

              <div className={styles.productTypesPanel}>
                <h3>Different Types of {selectedProduct.productName}</h3>
                <div className={styles.productTypesTableScroll}>
                  <table className={styles.productTypesTable}>
                    <thead>
                      <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Type of Product</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Warranty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.productTypes.map((type) => (
                        <tr key={type.productId}>
                          <td>{type.productId}</td>
                          <td>{type.productName}</td>
                          <td>{type.typeOfProduct}</td>
                          <td>{type.brand}</td>
                          <td>Rs. {type.price.toLocaleString("en-IN")}</td>
                          <td>{type.discount}</td>
                          <td>{type.warranty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        {renderModal()}
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className={styles.categoriesPage}>
        {/* <PageShell
          kicker="Category Details"
          title={selectedCategory.categoryName}
          userName={user?.name}
          stats={[
            ["Category ID", selectedCategory.categoryId],
            ["Products", selectedCategory.productCount],
            ["Status", selectedCategory.status],
            ["Last Updated", selectedCategory.updatedAt],
          ]}
        /> */}

        <section className={styles.detailPanel}>
          <div className={styles.detailToolbar}>
            <h2>{selectedCategory.categoryName} Details</h2>
            <div className={styles.toolbarActions}>
              <button type="button" onClick={() => setActiveModal("product")}>
                Add Product
              </button>
              <button type="button" onClick={handleBackToCategories}>
                Back
              </button>
            </div>
          </div>
          {/* 
          <div className={styles.detailGrid}>
            <article>
              <span>Total Products</span>
              <strong>{selectedCategory.productCount}</strong>
            </article>
            <article>
              <span>Last Updated</span>
              <strong>{selectedCategory.updatedAt}</strong>
            </article>
            <article>
              <span>Category Status</span>
              <strong>{selectedCategory.status}</strong>
            </article>
          </div> */}

          <div className={styles.productsPanel}>
            {/* <h3>Products in {selectedCategory.categoryName}</h3> */}
            <div className={styles.productsTableScroll}>
              <table className={styles.productsTable}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Products</th>
                    <th>Product ID</th>
                    <th>Types</th>
                    <th>Stock</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCategory.products.map((product) => (
                    <tr
                      key={product.productId}
                      className={styles.clickableRow}
                      onClick={() => handleProductClick(product.productId)}
                    >
                      <td>
                        <img
                          src={product.image}
                          alt={product.productName}
                          className={styles.productThumb}
                        />
                      </td>
                      <td>{product.productName}</td>
                      <td>{product.productId}</td>
                      <td>
                        {product.productTypes
                          .map((type) => type.typeOfProduct)
                          .join(", ")}
                      </td>
                      <td>{product.stock}</td>
                      <td>{selectedCategory.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        {renderModal()}
      </div>
    );
  }

  return (
    <div className={styles.categoriesPage}>
      <PageShell
        kicker="Categories"
        title="Organize product categories"
        userName={user?.name}
        stats={[
          ["Total Categories", categoryRows.length],
          ["Active Categories", activeCategoryCount],
          ["Total Products", totalProductCount],
        ]}
      />

      <section className={styles.tablePanel}>
        <div className={styles.tableToolbar}>
          <h2>Category Records</h2>
          <div className={styles.toolbarActions}>
            <button type="button" onClick={() => setActiveModal("category")}>
              Add Category
            </button>
            <label>
              Show
              <select value={pageSize} onChange={handlePageSizeChange}>
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              entries
            </label>
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Category Products</th>
                <th>Featured Products</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.categoryId}
                  className={styles.clickableRow}
                  onClick={() => handleCategoryClick(row.categoryId)}
                >
                  <td>{row.srNo}</td>
                  <td>{row.categoryId}</td>
                  <td>{row.categoryName}</td>
                  <td>{row.productCount}</td>
                  <td>{row.productNames.join(", ")}</td>
                  <td>
                    <span className={styles.status}>{row.status}</span>
                  </td>
                  <td>{row.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationBar}>
          <span>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + pageSize, categoryRows.length)} of{" "}
            {categoryRows.length} entries
          </span>

          <div className={styles.paginationActions}>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <strong>
              {currentPage} / {totalPages}
            </strong>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {renderModal()}
    </div>
  );
}
