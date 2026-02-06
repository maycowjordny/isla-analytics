ALTER TABLE linkedin_daily_metrics 
ADD CONSTRAINT unique_metric_date UNIQUE (metric_date);