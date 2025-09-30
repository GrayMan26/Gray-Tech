import Container from "../components/Container";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">
              Page not found
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. Let&apos;s get you back on track.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/" variant="primary">
              Go home
            </Button>
            <Button href="/contact">
              Contact us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
