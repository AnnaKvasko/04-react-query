interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p style={{ color: "crimson", textAlign: "center", fontWeight: "500" }}>
      {message}
    </p>
  );
}
