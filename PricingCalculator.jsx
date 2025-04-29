import React, { useState, useEffect } from 'react';

const plans = [
  {
    label: '单人写真',
    key: 'portrait photography - one person',
    basePrice: 139,
    duration: 1,
    overtimeChargePerHalfHour: 40,
  },
  {
    label: '双人写真',
    key: 'portrait photography - couple',
    basePrice: 179,
    duration: 1,
    overtimeChargePerHalfHour: 40,
  },
  {
    label: '签字仪式',
    key: 'wedding signing ceremony',
    basePrice: 289,
    duration: 1,
    overtimeChargePerHalfHour: 40,
  },
  {
    label: '婚礼跟拍',
    key: 'portrait photography - couple',
    basePrice: 300,
    duration: 1,
    overtimeChargePerHalfHour: 40,
  },
];

const travelChargeConfig = [
  { label: 'Missisauga', price: 0 },
  { label: 'DT Toronto', price: 9 },
  { label: 'North York', price: 15 },
  { label: 'Richmond Hill', price: 18 },
  { label: 'Scarbrough', price: 18 },
  { label: 'Vaughan', price: 18 },
  { label: 'Markham', price: 18 },
];

const PricingCalculator = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [duration, setDuration] = useState(1);
  const [hasPets, setHasPets] = useState(false);
  const [petCount, setPetCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(travelChargeConfig[0]);
  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [priceBreakdown, setPriceBreakdown] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const isPortraitPhotography = (plan) => {
    return plan?.key.includes('portrait photography');
  };

  const calculateOvertimeCharge = (plan, hours) => {
    if (hours <= plan.duration) return 0;
    const overtimeHours = hours - plan.duration;
    const halfHourBlocks = Math.ceil(overtimeHours * 2);
    return halfHourBlocks * plan.overtimeChargePerHalfHour;
  };

  const addAdditionalCharge = () => {
    const newCharge = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
    };
    setAdditionalCharges([...additionalCharges, newCharge]);
  };

  const updateAdditionalCharge = (id, field, value) => {
    setAdditionalCharges(
      additionalCharges.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge
      )
    );
  };

  const removeAdditionalCharge = (id) => {
    setAdditionalCharges(additionalCharges.filter((charge) => charge.id !== id));
  };

  useEffect(() => {
    if (!selectedPlan) {
      setPriceBreakdown([]);
      setTotalPrice(0);
      return;
    }

    const breakdown = [
      { name: '基础套餐费用', amount: selectedPlan.basePrice },
    ];

    // 计算超时费用
    const overtimeCharge = calculateOvertimeCharge(selectedPlan, duration);
    if (overtimeCharge > 0) {
      breakdown.push({ name: '超时费用', amount: overtimeCharge });
    }

    // 计算宠物费用
    if (isPortraitPhotography(selectedPlan) && hasPets && petCount > 0) {
      breakdown.push({ name: '宠物费用', amount: petCount * 20 });
    }

    // 添加交通费用
    if (selectedLocation.price > 0) {
      breakdown.push({ name: '交通费用', amount: selectedLocation.price });
    }

    // 添加额外费用项
    additionalCharges.forEach((charge) => {
      if (charge.name && charge.amount) {
        breakdown.push({ name: charge.name, amount: charge.amount });
      }
    });

    // 计算总价
    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

    setPriceBreakdown(breakdown);
    setTotalPrice(total);
  }, [selectedPlan, duration, hasPets, petCount, selectedLocation, additionalCharges]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">摄影套餐计算器</h2>

        {/* 套餐选择 */}
        <div className="space-y-2">
          <label className="block font-medium">选择套餐</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedPlan?.key || ''}
            onChange={(e) => setSelectedPlan(plans.find((p) => p.key === e.target.value) || null)}
          >
            <option value="">请选择套餐</option>
            {plans.map((plan) => (
              <option key={plan.key} value={plan.key}>
                {plan.label} (${plan.basePrice})
              </option>
            ))}
          </select>
        </div>

        {/* 宠物选项 - 仅在人像摄影时显示 */}
        {selectedPlan && isPortraitPhotography(selectedPlan) && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasPets"
                checked={hasPets}
                onChange={(e) => setHasPets(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="hasPets">携带宠物</label>
            </div>
            {hasPets && (
              <div className="ml-6">
                <label className="block">宠物数量</label>
                <input
                  type="number"
                  min="0"
                  value={petCount}
                  onChange={(e) => setPetCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 p-2 border rounded"
                />
              </div>
            )}
          </div>
        )}

        {/* 拍摄时长 */}
        <div className="space-y-2">
          <label className="block font-medium">拍摄时长（小时）</label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            value={duration}
            onChange={(e) => setDuration(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 地点选择 */}
        <div className="space-y-2">
          <label className="block font-medium">拍摄地点</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedLocation.label}
            onChange={(e) => {
              const location = travelChargeConfig.find((l) => l.label === e.target.value);
              if (location) setSelectedLocation(location);
            }}
          >
            {travelChargeConfig.map((location) => (
              <option key={location.label} value={location.label}>
                {location.label} (${location.price})
              </option>
            ))}
          </select>
        </div>

        {/* 附加费用项 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block font-medium">附加费用项</label>
            <button
              onClick={addAdditionalCharge}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              添加费用项
            </button>
          </div>
          {additionalCharges.map((charge) => (
            <div key={charge.id} className="flex space-x-2">
              <input
                type="text"
                placeholder="费用名称"
                value={charge.name}
                onChange={(e) => updateAdditionalCharge(charge.id, 'name', e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="金额"
                value={charge.amount}
                onChange={(e) =>
                  updateAdditionalCharge(charge.id, 'amount', parseFloat(e.target.value) || 0)
                }
                className="w-32 p-2 border rounded"
              />
              <button
                onClick={() => removeAdditionalCharge(charge.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 费用明细和总价 */}
      {selectedPlan && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">费用明细</h3>
          <div className="space-y-2">
            {priceBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name}</span>
                <span>${item.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>总价</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator;