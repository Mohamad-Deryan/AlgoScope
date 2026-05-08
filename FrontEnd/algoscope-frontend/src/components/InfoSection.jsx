function InfoSection({ pseudocodeContent, explanation }) {
  return (
    <div className="sorting-info">
      <div className="info-card pseudocode">
        <h3>Pseudocode</h3>
        {pseudocodeContent}
      </div>

      <div className="info-card explanation">
        <h3>Explanation</h3>
        <p>{explanation}</p>
      </div>
    </div>
  );
}

export default InfoSection;