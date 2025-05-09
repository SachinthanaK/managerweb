import classes from "./Card.module.css";

function ShortCard({ title, count, color }) {
  const cardStyle = {
    display: "flex",
    height: "120px",
    padding: "12px 12px 8px 16px",
    alignItems: "flex-start",
    gap: "20px",
    width: "24%",
    borderRadius: "12px",
    border: "1px solid #9ca3af",
    background: color || "#fff",
  };

  return (
    <>
      <div style={cardStyle}>
        <div className={classes.content2}>
          <h2> {title}</h2>
          <h1>{count}</h1>
        </div>
      </div>
    </>
  );
}

export default ShortCard;
