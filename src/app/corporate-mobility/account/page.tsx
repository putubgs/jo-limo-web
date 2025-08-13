export default function Account() {
  return (
    <div className="w-3/4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Company Name : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          placeholder="Input the company name"
          value="AVIS JORDAN"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Company Website : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          placeholder="Input the company website"
          value="google.com"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Company Address : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          placeholder="Input the company address"
          value="Shareef Jamil Bin Nasser Street. King Abdullah Gardens PO Box 961003 Amman 11196 Jordan"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Company Email : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          placeholder="Input the company email"
          value="HeadQuarterOffice@avis.com.jo"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Phone Number : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          placeholder="Input the company phone number"
          value="+962 09279092"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Billing Address : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          placeholder="Input the company billing address"
          value="Shareef Jamil Bin Nasser Street. King Abdullah Gardens PO Box 961003 Amman 11196 Jordan"
        />
      </div>
    </div>
  );
}
