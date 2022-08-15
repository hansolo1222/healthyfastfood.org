export const SectionDisclaimer = ({restaurantName}) => {
  return (
    <section>
      <div className="text-sm mt-16 text-stone-600">
        Please note that item availability varies by restaurant location.
        <br />
        <br />
        Calories and other nutritional information will vary based on
        modifications made to item. Product availability, prices, offers and
        discounts may vary from in-restaurant. Before using coupons check if{" "}
        {restaurantName} printed coupons are valid for online or food-delivery
        orders.
        <br />
        <br />
        2,000 calories a day is used for general nutrition advice. Calorie and
        nutrient needs will vary depending on person.
        <br />
        <br />
        Warning: High Sodium intake can increase blood pressure and risk of
        heart disease and stroke.
      </div>
    </section>
  );
};
