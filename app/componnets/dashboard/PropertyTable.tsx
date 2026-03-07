export default function PropertyTable() {
  return (
    <div className="bg-white rounded-2xl border border-[#f0f2f8] shadow-sm px-2 py-2 mt-6" style={{ boxShadow: "0 4px 16px 0 #e9eef7" }}>
      <div className="px-6 pt-4 pb-2">
        <h2 className="font-semibold mb-2 text-base">Property List</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f6f8fa] text-black font-semibold">
              <th className="text-left px-3 py-2">ID/Spot</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Possession Type</th>
              <th className="px-3 py-2">Property Tag Date</th>
              <th className="px-3 py-2">Phase</th>
              <th className="px-3 py-2">Zone</th>
              <th className="px-3 py-2">Khayaban</th>
              <th className="px-3 py-2">Floor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#f6f8fa] text-gray-700">
              <td className="px-3 py-2">14 R-001</td>
              <td className="px-3 py-2">Commercial</td>
              <td className="px-3 py-2">Shop</td>
              <td className="px-3 py-2">Tenant</td>
              <td className="px-3 py-2">25-01-2026</td>
              <td className="px-3 py-2">Phase VIII</td>
              <td className="px-3 py-2">N/A</td>
              <td className="px-3 py-2">Khayaban-e-Ittehad</td>
              <td className="px-3 py-2">02</td>
            </tr>
            <tr className="bg-[#f6fef8] text-gray-700">
              <td className="px-3 py-2">14 R-002</td>
              <td className="px-3 py-2">Commercial</td>
              <td className="px-3 py-2">Shop</td>
              <td className="px-3 py-2">Owner</td>
              <td className="px-3 py-2">25-01-2026</td>
              <td className="px-3 py-2">Phase VIII</td>
              <td className="px-3 py-2">N/A</td>
              <td className="px-3 py-2">Khayaban-e-Faisal</td>
              <td className="px-3 py-2">04</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
