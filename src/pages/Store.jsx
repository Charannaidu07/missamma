// import React, { useEffect, useState } from "react";
// import MeImage from "../assets/Meeeeeeee.jpg"; // Replace with your image

// const Store = () => {
//   const [products, setProducts] = useState([]);

//   // Dummy products array
//   // const dummyProducts = [
//   //   { id: 1, name: "Bespoke Ring", price: 500, description: "Elegant gold ring", image: MeImage },
//   //   { id: 2, name: "Bespoke Ring", price: 600, description: "Elegant gold ring", image: MeImage },
//   //   { id: 3, name: "Bespoke Ring", price: 800, description: "Elegant gold ring", image: MeImage },
//   //   { id: 4, name: "Bespoke Ring", price: 1000, description: "Elegant gold ring", image: MeImage }
//   // ];

//   useEffect(() => {
//     setProducts(dummyProducts);
//   }, []);

//   const addToCart = (product) => {
//     let cart = JSON.parse(localStorage.getItem("cart") || "[]");
//     const existing = cart.find((c) => c.product_id === product.id);
//     if (existing) existing.quantity += 1;
//     else cart.push({ product_id: product.id, name: product.name, price: product.price, quantity: 1 });
//     localStorage.setItem("cart", JSON.stringify(cart));
//     alert("Added to cart");
//   };

//   // return (
//   //   <div className="card" style={{ padding: "1rem" }}>
//   //     <h2>Bespoke Jewelry Store</h2>
//   //     <div
//   //       style={{
//   //         display: "grid",
//   //         gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//   //         gap: "1rem",
//   //         marginTop: "1.2rem"
//   //       }}
//   //     >
//   //       {products.map((p) => (
//   //         <div key={p.id} className="card" style={{ padding: "1rem" }}>
//   //           {/* Product Image */}
//   //           <img
//   //             src={p.image}
//   //             alt={p.name}
//   //             style={{
//   //               width: "100%",
//   //               height: "200px",
//   //               objectFit: "cover",
//   //               borderRadius: "8px",
//   //               marginBottom: "0.5rem"
//   //             }}
//   //           />
//   //           {/* Product Name */}
//   //           <div style={{ fontWeight: 600 }}>{p.name}</div>
//   //           {/* Product Description */}
//   //           <div style={{ fontSize: "0.8rem", opacity: 0.8, margin: "0.4rem 0" }}>{p.description}</div>
//   //           {/* Product Price */}
//   //           <div style={{ fontWeight: 600 }}>₹ {p.price}</div>

//   //           {/* Buttons */}
//   //           <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.8rem" }}>
//   //             <button className="btn-primary" onClick={() => addToCart(p)}>
//   //               Add to Cart
//   //             </button>
//   //             <button className="btn-primary" onClick={() => alert(`Viewing details for ${p.name}`)}>
//   //               View Details
//   //             </button>
//   //           </div>
//   //         </div>
//   //       ))}
//   //     </div>
//   //   </div>
//   // );
// return (
//     <div className="card">
//       <h2>Bespoke Jewelry Store</h2>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//           gap: "1rem",
//           marginTop: "1.2rem",
//         }}
//       >
//         {products.map((p) => (
//           <div key={p.id} className="card" style={{ padding: "1rem" }}>
//             <div style={{ fontWeight: 600 }}>{p.name}</div>
//             <div style={{ fontSize: "0.8rem", opacity: 0.8, margin: "0.4rem 0" }}>
//               {p.description}
//             </div>
//             <div style={{ fontWeight: 600 }}>₹ {p.price}</div>
//             <button
//               className="btn-primary"
//               style={{ marginTop: "0.8rem" }}
//               onClick={() => addToCart(p)}
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

// };

// export default Store;
import React, { useEffect, useState } from "react";
import { api } from "../api";

const Store = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/store/products/").then((res) => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c) => c.product_id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ product_id: product.id, name: product.name, price: product.price, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div className="card">
      <h2>Bespoke Jewelry Store</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "1rem",
          marginTop: "1.2rem",
        }}
      >
        {products.map((p) => (
          <div key={p.id} className="card" style={{ padding: "1rem" }}>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: "0.8rem", opacity: 0.8, margin: "0.4rem 0" }}>
              {p.description}
            </div>
            <div style={{ fontWeight: 600 }}>₹ {p.price}</div>
            <button
              className="btn-primary"
              style={{ marginTop: "0.8rem" }}
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
