import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os

def perform_eda(data_path='data/credit_risk_dataset.csv', output_dir='results/eda'):
    os.makedirs(output_dir, exist_ok=True)
    df = pd.read_csv(data_path)
    
    # 1. Loan Status Distribution
    plt.figure(figsize=(8, 6))
    sns.countplot(x='loan_status', data=df, palette='viridis')
    plt.title('Distribution of Loan Status (0: No Default, 1: Default)')
    plt.savefig(f'{output_dir}/loan_status_dist.png')
    plt.close()
    
    # 2. Income vs Loan Amount by Status
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='person_income', y='loan_amnt', hue='loan_status', data=df, alpha=0.5)
    plt.title('Income vs Loan Amount (Colored by Status)')
    plt.savefig(f'{output_dir}/income_vs_loan.png')
    plt.close()
    
    # 3. Correlation Heatmap
    # Filter for numeric columns for correlation
    numeric_df = df.select_dtypes(include=['number'])
    plt.figure(figsize=(12, 10))
    sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Correlation Heatmap')
    plt.savefig(f'{output_dir}/correlation_heatmap.png')
    plt.close()
    
    # 4. Loan Intent vs Status
    plt.figure(figsize=(12, 6))
    sns.countplot(x='loan_intent', hue='loan_status', data=df)
    plt.xticks(rotation=45)
    plt.title('Loan Intent vs Loan Status')
    plt.savefig(f'{output_dir}/intent_vs_status.png')
    plt.close()
    
    print(f"EDA complete. Visualizations saved to {output_dir}")

if __name__ == "__main__":
    perform_eda()
