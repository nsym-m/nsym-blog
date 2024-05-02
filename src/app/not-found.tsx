import Link from "next/link";

const Custom404: React.VFC = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "5rem",
          fontSize: "1rem",
        }}>
        <p>404 Not Found</p>
        <p style={{ marginTop: "2rem" }}>このページは存在しません</p>
        <Link href="/"><span>←back to the HOME</span></Link>
      </div>
    </>
  );
};

export default Custom404;
