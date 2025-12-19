export default function AnalyticsPanel({ analytics }) {
  return (
    <div className="fixed bottom-4 right-4 w-64 sm:w-72 p-4 rounded-2xl shadow-2xl
                    bg-white dark:bg-gray-900 border dark:border-gray-700">
      <h3 className="font-bold mb-2">📊 Analytics</h3>
      <p>Total Queries: <b>{analytics.totalQueries}</b></p>
      <p>Last Intent: <b>{analytics.lastIntent}</b></p>
      <p>
        Confidence:{" "}
        <b className={analytics.lastConfidence < 40 ? "text-orange-400" : "text-green-400"}>
          {analytics.lastConfidence}%
        </b>
      </p>
    </div>
  );
};