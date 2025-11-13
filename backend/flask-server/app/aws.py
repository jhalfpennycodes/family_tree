import os
import boto3 
import botocore


s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('ACCESS_KEY'),
    aws_secret_access_key=os.getenv('SECRET_ACCESS_KEY'),
    region_name='us-east-1'
)


def s3_upload(file, filename):
    s3_client = boto3.client('s3')
    try:
        s3_client.upload_file(file, "free-family-tree-bucket", filename)
    except botocore.exceptions.ClientError as e:
        print("AWS ClientError:", e)
        raise
    except Exception as e:
        print("Unexpected error:", e)
        raise

