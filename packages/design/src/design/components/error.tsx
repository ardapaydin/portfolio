export default function Error() {
    return (
        <div className="flex flex-col items-center max-w-3xl m-auto justify-center border border-dashed border-red-500 text-white p-10 rounded-lg space-y-4">
            <h1 className="text-6xl font-bold text-red-500 mb-4">
                :(
            </h1>
            <p className="text-lg text-gray-300">
                An error occurred while fetching data. Please try again later.
            </p>
        </div>
    );
}