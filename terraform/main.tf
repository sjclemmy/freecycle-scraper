resource "aws_lambda_function" "scraper" {
  filename      = "../dist/output.zip"
  function_name = "${local.namespace}-${var.environment}"
  role          = aws_iam_role.scraper.arn
  handler       = "src/index.handler"
  description   = "Scrapes the freecycle site"

  source_code_hash               = filebase64sha256("../dist/output.zip")
  runtime                        = local.lambda_runtime
  timeout                        = 15
  reserved_concurrent_executions = 5
  memory_size                    = 1024

  environment {
    variables = {
      LOG_LEVEL = var.log_level
    }
  }
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "scraper" {
  name               = "${local.namespace}-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "scraper_cloudwatch" {
  role       = aws_iam_role.scraper.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

resource "aws_cloudwatch_event_rule" "scheduler" {
  name                = "${local.namespace}-scheduler-${var.environment}"
  description         = "Schedule to trigger the scraper"
  schedule_expression = "rate(10 minutes)"
}

resource "aws_cloudwatch_event_target" "scheduler" {
  arn  = aws_lambda_function.scraper.arn
  rule = aws_cloudwatch_event_rule.scheduler.name
}


resource "aws_lambda_permission" "scheduler" {
  statement_id  = "AllowExecutionFomEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.scraper.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.scheduler.arn
}

resource "aws_iam_role" "scheduler" {
  name               = "${local.namespace}-scheduler-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "scheduler_cloudwatch" {
  role       = aws_iam_role.scheduler.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}
