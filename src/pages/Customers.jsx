import React, { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import styles from "./Customers.module.css";
import { updatePharmacyOwner, deletePharmacyOwner } from "../firebaseService";

const Customers = () => {
  const { owners, loading } = useOrders();
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editCredentials, setEditCredentials] = useState(false);

  const handleEdit = (owner) => {
    setSelectedOwner(owner);
    setIsPopupOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      await deletePharmacyOwner(id);

      window.location.reload(); // Refresh to show updated data
    }
  };

  const handleSave = async () => {
    await updatePharmacyOwner(selectedOwner.id, selectedOwner);
    setIsPopupOpen(false);
    window.location.reload(); // Refresh data after save
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>Pharmacy Owners</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Pharmacy Name</th>
            <th>Registration Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner, index) => (
            <tr key={owner.id}>
              <td>{index + 1}</td>
              <td>{owner.pharmacyName}</td>
              <td>{owner.registrationNumber}</td>
              <td>{`${owner.firstName} ${owner.lastName}`}</td>
              <td>{owner.email}</td>
              <td>{owner.phoneNumber}</td>
              <td>
                {`${owner.addressNumber}, ${owner.street}, ${owner.city}, ${owner.province} province`}
              </td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(owner)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(owner.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Edit Pharmacy Owner</h2>
            <form className={styles.form}>
              <label>Pharmacy Name</label>
              <input
                type="text"
                value={selectedOwner.pharmacyName}
                onChange={(e) =>
                  setSelectedOwner({
                    ...selectedOwner,
                    pharmacyName: e.target.value,
                  })
                }
              />
              <label>Registration Number</label>
              <input
                type="text"
                value={selectedOwner.registrationNumber}
                onChange={(e) =>
                  setSelectedOwner({
                    ...selectedOwner,
                    registrationNumber: e.target.value,
                  })
                }
              />
              <label>First Name</label>
              <input
                type="text"
                value={selectedOwner.firstName}
                onChange={(e) =>
                  setSelectedOwner({
                    ...selectedOwner,
                    firstName: e.target.value,
                  })
                }
              />
              <label>Last Name</label>
              <input
                type="text"
                value={selectedOwner.lastName}
                onChange={(e) =>
                  setSelectedOwner({
                    ...selectedOwner,
                    lastName: e.target.value,
                  })
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={selectedOwner.email}
                onChange={(e) =>
                  setSelectedOwner({ ...selectedOwner, email: e.target.value })
                }
              />
              <label>Phone Number</label>
              <input
                type="text"
                value={selectedOwner.phoneNumber}
                onChange={(e) =>
                  setSelectedOwner({
                    ...selectedOwner,
                    phoneNumber: e.target.value,
                  })
                }
              />
              <label>Address</label>
              <input
                value={`${selectedOwner.addressNumber}, ${selectedOwner.street}, ${selectedOwner.city}, ${selectedOwner.province}`}
                onChange={(e) =>
                  setSelectedOwner({
                    ...selectedOwner,
                    address: e.target.value,
                  })
                }
              />

              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.editCredentialsButton}
                onClick={() => setEditCredentials(!editCredentials)}
              >
                {editCredentials ? "Hide" : "Edit"} Credentials
              </button>

              {editCredentials && (
                <div className={styles.credentialsSection}>
                  <label>Username</label>
                  <input
                    type="text"
                    value={selectedOwner.username || ""}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        username: e.target.value,
                      })
                    }
                  />
                  <label>Password</label>
                  <input
                    type="password"
                    value={selectedOwner.password || ""}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
