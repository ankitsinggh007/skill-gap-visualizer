import { Link, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import notFoundIllustration from "@/assets/page_not_found.svg";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="space-y-6 text-center">
        <div className="flex items-center justify-center">
          <img
            src={notFoundIllustration}
            alt="Page not found"
            className="h-32 w-32"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Page not found
          </h1>
          <p className="text-gray-600">
            The page you are looking for does not exist or has moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
