import React from "react";
import "./relatedproduct.css";
import data_product from "../assets/data";
import Item from "../item/item";

const RelatedProduct = () => {
    return (
        <section className="relatedproduct">
            <div className="section-header">
                <span className="section-pill">COMPLETE THE LOOK</span>
                <h2 className="section-title">You Might Also Like</h2>
                <div className="section-divider"></div>
            </div>

            <div className="relatedproduct-item">
                {data_product.map((item, i) => (
                    <Item
                        key={item.id || i}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        new_price={item.new_price}
                        old_price={item.old_price}
                    />
                ))}
            </div>
        </section>
    );
};

export default RelatedProduct;
