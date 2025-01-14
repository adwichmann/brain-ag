import { TailSpin } from "react-loader-spinner";

const LoaderSpin = ({ className }: { className?: string }) => {
  className = className
    ? className
    : "flex items-center justify-center h-screen y-screen w-full";
  return (
    <TailSpin
      visible={true}
      height="40"
      width="40"
      color="rgb(26, 131, 255)"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass={className}
    />
  );
};

export default LoaderSpin;
