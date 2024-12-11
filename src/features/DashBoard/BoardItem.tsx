interface BoardItemProps {
    name: string;
    imageUrl?: string;
}

const BoardItem: React.FC<BoardItemProps> = ({ name, imageUrl }) => {
    return (
        <>

            <div className="flex flex-row w-full bg-blue-100 p-4 gap-4 items-center">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-8 h-8 rounded-full object-cover"
                />
                <p>{name}</p>
            </div>
        </>

    );
};

export default BoardItem;