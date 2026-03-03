import Alert from "./Alert";
import Button from "./Button";

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this screen. Please try again.",
  actionLabel = "Retry",
  onRetry,
}) {
  return (
    <Alert variant="error" className="items-start">
      <div className="space-y-2">
        <div className="font-medium">{title}</div>
        <div className="text-sm">{message}</div>
        {onRetry && (
          <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
            {actionLabel}
          </Button>
        )}
      </div>
    </Alert>
  );
}
