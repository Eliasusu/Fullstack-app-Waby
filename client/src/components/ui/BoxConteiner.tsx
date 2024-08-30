export default function BoxContainer({children, width, height, padding}: {children: React.ReactNode, width: string, height: string, padding: string}) {
    return (
        <div className={`bg-grey-box/60 border-[1px] border-white/30 backdrop-blur-[6px] rounded-2xl shadow-lg m-auto ${width} ${height} ${padding}`}>
            {children}
        </div>
    );
}