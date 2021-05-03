import { Item } from '../../data/definitions'

export const BriefcaseItem = (item: Item) => {
  return (
    <div className="grid-item">
      <div className="label">{item.displayName}</div>

      <style jsx global>{`
        .grid-item {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
          color: #ffffff;
          border: 1px dashed rgba(255, 255, 255, 0.5);

          .label {
            pointer-events: none;
          }

          .quantity {
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 0.66rem;
            background-color: rgba(0, 0, 0, 0.9);
            padding: 0.3rem 0.5rem;
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  )
}
