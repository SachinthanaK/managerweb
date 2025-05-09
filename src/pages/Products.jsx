import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { mobileDb } from "../firebase";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import classes from "./Products.module.css";
import axios from "axios";

const Products = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [designData, setDesignData] = useState({
    id: "",
    name: "",
    description: "",
    image: null,
    imageUrl: "",
    available: true, // Default to available
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(mobileDb, "Products");
      const snapshot = await getDocs(productsCollection);
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductData(products);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesignChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setDesignData({ ...designData, image: file });
      previewFile(file);
    } else if (name === "available") {
      setDesignData({ ...designData, available: value === "true" }); // Convert to boolean
    } else {
      setDesignData({ ...designData, [name]: value });
    }
  };

  const handleEdit = (product) => {
    setDesignData({
      id: product.id,
      name: product.name,
      description: product.description,
      image: null,
      imageUrl: product.imageURL,
      available: product.available ?? true, // Default to true if undefined
    });
    setPreviewImage(product.imageURL);
    setIsEditMode(true);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(mobileDb, "Products", id));
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = designData.imageUrl;

      if (designData.image) {
        const formData = new FormData();
        formData.append("image", designData.image);
        const result = await axios.post("http://localhost:5000/products", {
          image: previewImage,
        });
        imageUrl = result.data.secure_url;
      }

      if (isEditMode) {
        const designRef = doc(mobileDb, "Products", designData.id);
        await updateDoc(designRef, {
          name: designData.name,
          description: designData.description,
          sizes,
          imageURL: imageUrl,
          available: designData.available,
        });
        alert("Product updated successfully!");
      } else {
        await addDoc(collection(mobileDb, "Products"), {
          name: designData.name,
          description: designData.description,
          available: designData.available,
          imageURL: imageUrl,
          sizes,
        });
        alert("Product added successfully!");
      }

      setDesignData({
        id: "",
        name: "",
        description: "",
        image: null,
        imageUrl: "",
        available: true, // Reset to default
      });
      setPreviewImage(null);
      setSizes([]);
      setIsEditMode(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving design: ", error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.flexWrap}>
        <div className={classes.leftPanel}>
          <div className={classes.tableContainer}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>
                        {product.imageURL && (
                          <img
                            src={product.imageURL}
                            alt={product.name}
                            className={classes.productImage}
                          />
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.available ? "Available" : "Unavailable"}</td>
                      <td>
                        <button onClick={() => handleEdit(product)}>
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={classes.deleteButton}
                        >
                          <FaTrash size={20} color="red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className={classes.rightPanel}>
          <form onSubmit={handleSubmit}>
            <label>Design Name</label>
            <input
              type="text"
              name="name"
              value={designData.name}
              onChange={handleDesignChange}
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              value={designData.description}
              onChange={handleDesignChange}
              required
            ></textarea>

            {isEditMode && (
              <>
                <label>Availability</label>
                <select
                  name="available"
                  value={designData.available ? "true" : "false"}
                  onChange={handleDesignChange}
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </>
            )}

            <label>Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleDesignChange}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className={classes.preview}
              />
            )}

            <button type="submit">
              {isEditMode ? "Save Changes" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Products;
