import OfframpWidget from '@/components/OfframpWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crypto Offramp Widget
          </h1>
          <p className="text-lg text-gray-600">
            Convert your cryptocurrency to fiat currency instantly
          </p>
        </div>

        {/* Widget Container */}
        <div className="flex justify-center">
          <OfframpWidget />
        </div>

        {/* Integration Info */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Embed this widget on your website
          </h2>
          <p className="text-gray-600 mb-4">
            This widget is designed to be embedded on marketing websites and provides 
            a seamless crypto-to-fiat conversion experience for your users.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <code className="text-sm text-gray-700">
              {'<iframe src="https://your-domain.com/widget" width="400" height="600"></iframe>'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}