import OfframpWidget from '@/components/OfframpWidget';

export default function WidgetPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        background: 'transparent',
        margin: 0,
        padding: 0,
        border: 'none',
        boxShadow: 'none'
      }}
    >
      <OfframpWidget />
    </div>
  );
}
