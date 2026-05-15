import './Loader.css';

export default function Loader({ text = 'Thinking...' }) {
  return (
    <div className="loader-wrap">
      <div className="loader-dots">
        <span /><span /><span />
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
}
