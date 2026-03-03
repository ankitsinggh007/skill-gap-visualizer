import { useEffect, useMemo, useRef } from "react";
import Chart from "chart.js/auto";
import SectionCard from "./SectionCard";

export default function SkillRadar({ categoryScores }) {
  const safeScores = useMemo(
    () => (Array.isArray(categoryScores) ? categoryScores : []),
    [categoryScores]
  );
  const { labels, values } = useMemo(() => {
    const labels = safeScores.map((item) => item?.category ?? "Other");
    const values = safeScores.map((item) => {
      const raw =
        Number(
          item?.percentage ??
            (item?.score && item?.max ? (item.score / item.max) * 100 : 0)
        ) || 0;
      return Math.max(0, Math.min(100, raw));
    });

    return { labels, values };
  }, [safeScores]);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const hasData = safeScores.length > 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasData) {
      chartRef.current?.destroy();
      chartRef.current = null;
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    if (chartRef.current) {
      chartRef.current.data.labels = labels;
      chartRef.current.data.datasets[0].data = values;
      chartRef.current.update();
      return undefined;
    }

    chartRef.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels,
        datasets: [
          {
            label: "Coverage",
            data: values,
            fill: true,
            backgroundColor: "rgba(37, 99, 235, 0.2)",
            borderColor: "rgba(37, 99, 235, 0.9)",
            pointBackgroundColor: "rgba(37, 99, 235, 0.9)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(37, 99, 235, 0.9)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { backdropColor: "transparent" },
            grid: { color: "rgba(148, 163, 184, 0.4)" },
            angleLines: { color: "rgba(148, 163, 184, 0.4)" },
            pointLabels: {
              color: "#374151",
              font: { size: 12, weight: "600" },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [hasData, labels, values]);

  if (!hasData) {
    return (
      <SectionCard title="Skill Radar">
        <p className="text-gray-600">None found</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Skill Radar">
      <p className="text-sm text-gray-600">
        Coverage by category (0–100%). Higher is better.
      </p>
      <div className="relative mt-4 h-72 w-full sm:h-80">
        <canvas ref={canvasRef} />
      </div>
    </SectionCard>
  );
}
