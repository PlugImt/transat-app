import { ReservationCardLoading } from "@/components/custom/card/ReservationCard";
import { Page } from "@/components/page/Page";

interface ReservationSkeletonProps {
  title: string;
  itemCount?: number;
}

export const ReservationSkeleton = ({ 
  title, 
  itemCount = 5 
}: ReservationSkeletonProps) => {
  return (
    <Page title={title} className="gap-2">
      {Array.from({ length: itemCount }).map((_, index) => (
        <ReservationCardLoading
          key={`reservation-loading-${index.toString()}`}
        />
      ))}
    </Page>
  );
};
