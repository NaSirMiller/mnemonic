import ClipLoader from "react-spinners/ClipLoader";

type LoadingSpinnerProps = {
  spinnerColor?: string;
  isLoading?: boolean;
  spinnerSize?: number;
};

export function LoadingSpinner({
  spinnerColor = "#3498db",
  isLoading = true,
  spinnerSize = 50,
}: LoadingSpinnerProps) {
  return (
    <ClipLoader
      color={spinnerColor}
      loading={isLoading}
      size={spinnerSize}
    ></ClipLoader>
  );
}
