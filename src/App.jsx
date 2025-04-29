import { useState } from "react";
import { plans, travelChargeConfig } from "./constants";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Select from "@radix-ui/react-select";
// import { ReactComponent as DeleteIcon } from './assets/delete.svg';

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [hasPet, setHasPet] = useState(false);
  const [petCount, setPetCount] = useState(0);
  const [duration, setDuration] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(
    travelChargeConfig[0]
  );
  const [additionalItems, setAdditionalItems] = useState([]);
  // New state variables for wedding photography
  const [weddingOption, setWeddingOption] = useState("hourly"); // 'hourly' or 'package'
  const [cameraCount, setCameraCount] = useState("single"); // 'single' or 'double'
  // New state variable for custom overtime rate
  const [customOvertimeRate, setCustomOvertimeRate] = useState(null);

  const isWeddingPhotography = selectedPlan?.key === "wedding day coverage";

  const calculateTotal = () => {
    let total = 0;

    // Base price
    if (selectedPlan) {
      if (isWeddingPhotography) {
        if (weddingOption === "package") {
          total += 699; // Fixed price for 8-hour package
          if (duration > 8) {
            const overtimeRate = customOvertimeRate || 180; // Use custom rate if set, otherwise default to 180
            total += (duration - 8) * overtimeRate;
          }
        } else {
          // Hourly rate
          const hourlyRate = cameraCount === "single" ? 100 : 180;
          total += duration * hourlyRate;
        }
      } else {
        total += selectedPlan.basePrice;
      }
    }

    // Pet charges
    if (hasPet && isPortraitPhotography) {
      total += petCount * 20;
    }

    // Overtime charges for non-wedding plans
    if (
      !isWeddingPhotography &&
      selectedPlan &&
      duration > selectedPlan.duration
    ) {
      const overtimeHours = duration - selectedPlan.duration;
      const overtimeRate =
        customOvertimeRate || selectedPlan.overtimeChargePerHalfHour * 2;
      total += overtimeHours * overtimeRate;
    }

    // Travel charges
    total += selectedLocation.price;

    // Additional items
    total += additionalItems.reduce((sum, item) => sum + item.price, 0);

    return total;
  };

  const addAdditionalItem = () => {
    setAdditionalItems([...additionalItems, { name: "", price: 0 }]);
  };

  const updateAdditionalItem = (index, field, value) => {
    const newItems = [...additionalItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setAdditionalItems(newItems);
  };

  const removeAdditionalItem = (index) => {
    setAdditionalItems(additionalItems.filter((_, i) => i !== index));
  };

  const isPortraitPhotography = selectedPlan?.key.includes(
    "portrait photography"
  );

  const generateCostSummary = () => {
    const parts = [];

    // Base price
    if (selectedPlan) {
      if (isWeddingPhotography) {
        if (weddingOption === "package") {
          parts.push(`8小时婚礼套餐 $699`);
          if (duration > 8) {
            const overtimeRate = customOvertimeRate || 180;
            parts.push(
              `超时${duration - 8}小时 $${(duration - 8) * overtimeRate}`
            );
          }
        } else {
          const hourlyRate = cameraCount === "single" ? 100 : 180;
          parts.push(
            `${
              cameraCount === "single" ? "单机位" : "双机位"
            }婚礼跟拍 $${hourlyRate}/小时 × ${duration}小时`
          );
        }
      } else {
        parts.push(`${selectedPlan.label} $${selectedPlan.basePrice}`);
      }
    }

    // Pet charges
    if (hasPet && isPortraitPhotography && petCount > 0) {
      parts.push(`${petCount}只宠物 $${petCount * 20}`);
    }

    // Travel charges
    if (selectedLocation.price > 0) {
      parts.push(`${selectedLocation.label}交通费 $${selectedLocation.price}`);
    }

    // Additional items
    if (additionalItems.length > 0) {
      const additionalTotal = additionalItems.reduce(
        (sum, item) => sum + item.price,
        0
      );
      if (additionalTotal > 0) {
        parts.push(`附加项 $${additionalTotal}`);
      }
    }

    // Overtime charges for non-wedding plans
    if (
      !isWeddingPhotography &&
      selectedPlan &&
      duration > selectedPlan.duration
    ) {
      const overtimeHours = duration - selectedPlan.duration;
      const overtimeRate =
        customOvertimeRate || selectedPlan.overtimeChargePerHalfHour * 2;
      parts.push(`超时${overtimeHours}小时 $${overtimeHours * overtimeRate}`);
    }

    return parts.join(" + ");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Cube Studio Price Calculator</h1>

        {/* Plan Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">选择套餐</h2>
          <div className="grid grid-cols-2 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.key}
                onClick={() => setSelectedPlan(plan)}
                className={`p-4 rounded-lg border ${
                  selectedPlan?.key === plan.key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <div className="font-medium">{plan.label}</div>
                <div className="text-gray-600">
                  {plan.key === "wedding day coverage"
                    ? "请选择拍摄方式"
                    : `$${plan.basePrice}`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Wedding Photography Options */}
        {isWeddingPhotography && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">婚礼跟拍选项</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setWeddingOption("hourly")}
                  className={`p-3 rounded-lg border ${
                    weddingOption === "hourly"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  按小时计费
                </button>
                <button
                  onClick={() => setWeddingOption("package")}
                  className={`p-3 rounded-lg border ${
                    weddingOption === "package"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  8小时套餐 ($699)
                </button>
              </div>

              {weddingOption === "hourly" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setCameraCount("single")}
                    className={`p-3 rounded-lg border ${
                      cameraCount === "single"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    单机位 ($100/小时)
                  </button>
                  <button
                    onClick={() => setCameraCount("double")}
                    className={`p-3 rounded-lg border ${
                      cameraCount === "double"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    双机位 ($180/小时)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pet Options */}
        {isPortraitPhotography && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Checkbox.Root
                className="w-5 h-5 border rounded mr-2"
                checked={hasPet}
                onCheckedChange={setHasPet}
              >
                <Checkbox.Indicator>✓</Checkbox.Indicator>
              </Checkbox.Root>
              <label>携带宠物</label>
            </div>
            {hasPet && (
              <div className="ml-7">
                <label className="block mb-1">宠物数量</label>
                <input
                  type="number"
                  min="0"
                  value={petCount}
                  onChange={(e) => setPetCount(parseInt(e.target.value) || 0)}
                  className="border rounded p-2 w-24"
                />
              </div>
            )}
          </div>
        )}

        {/* Duration and Overtime Rate */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block mb-1">拍摄时长（小时）</label>
              <input
                type="number"
                min={
                  isWeddingPhotography && weddingOption === "hourly" ? 3 : 0.5
                }
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
                className="border rounded p-2 w-24"
              />
              {isWeddingPhotography &&
                weddingOption === "hourly" &&
                duration < 3 && (
                  <p className="text-red-500 text-sm mt-1">
                    婚礼跟拍最少需要3小时
                  </p>
                )}
            </div>

            {/* Custom Overtime Rate Input */}
            {(isWeddingPhotography &&
              weddingOption === "package" &&
              duration > 8) ||
              (!isWeddingPhotography &&
                selectedPlan &&
                duration > selectedPlan.duration && (
                  <div>
                    <label className="block mb-1">超时每小时费用</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={
                        customOvertimeRate != null
                          ? customOvertimeRate
                          : isWeddingPhotography
                          ? 180
                          : selectedPlan.overtimeChargePerHalfHour * 2
                      }
                      onChange={(e) => {
                        console.log(e.target.value);
                        setCustomOvertimeRate(Number(e.target.value) || 0);
                      }}
                      className="border rounded p-2 w-32"
                    />
                  </div>
                ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block mb-1">拍摄地点</label>
          <select
            value={selectedLocation.label}
            onChange={(e) => {
              const location = travelChargeConfig.find(
                (loc) => loc.label === e.target.value
              );
              setSelectedLocation(location);
            }}
            className="border rounded p-2 w-full"
          >
            {travelChargeConfig.map((location) => (
              <option key={location.label} value={location.label}>
                {location.label} (${location.price})
              </option>
            ))}
          </select>
        </div>

        {/* Additional Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">附加费用项</h2>
            <button
              onClick={addAdditionalItem}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              +
            </button>
          </div>
          {additionalItems.map((item, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                placeholder="项目名称"
                value={item.name}
                style={{
                  width: "70%",
                }}
                onChange={(e) =>
                  updateAdditionalItem(index, "name", e.target.value)
                }
                className="border rounded p-2 flex-1"
              />
              <input
                style={{
                  width: "20%",
                }}
                type="number"
                placeholder="金额"
                value={item.price}
                onChange={(e) =>
                  updateAdditionalItem(
                    index,
                    "price",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="border rounded p-2 w-24"
              />
              <button
                style={{
                  width: "10%",
                }}
                onClick={() => removeAdditionalItem(index)}
                className="text-white px-4 py-2 rounded"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="23"
                    height="23"
                    rx="3.5"
                    fill="#EB6137"
                    stroke="#EB6137"
                  />
                  <path
                    d="M16.667 7.33325L7.33365 16.6666M7.33365 7.33325L16.667 16.6666"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="mt-8 border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">费用明细</h2>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              宝，总价是：{generateCostSummary()} = ${calculateTotal()}
            </p>
          </div>
          <div className="space-y-2">
            {selectedPlan && (
              <div className="flex justify-between">
                <span>套餐费用</span>
                <span>
                  {isWeddingPhotography ? (
                    weddingOption === "package" ? (
                      <span>$699 (8小时套餐)</span>
                    ) : (
                      <span>
                        ${cameraCount === "single" ? 100 : 180}/小时 ×{" "}
                        {duration}小时
                      </span>
                    )
                  ) : (
                    <span>${selectedPlan.basePrice}</span>
                  )}
                </span>
              </div>
            )}
            {hasPet && isPortraitPhotography && (
              <div className="flex justify-between">
                <span>宠物费用 ({petCount} 只)</span>
                <span>${petCount * 20}</span>
              </div>
            )}
            {isWeddingPhotography &&
              weddingOption === "package" &&
              duration > 8 && (
                <div className="flex justify-between">
                  <span>超时费用</span>
                  <span>
                    ${(duration - 8) * (customOvertimeRate || 180)}
                    {customOvertimeRate && (
                      <span className="text-sm text-gray-500">
                        {" "}
                        (自定义费率)
                      </span>
                    )}
                  </span>
                </div>
              )}
            {!isWeddingPhotography &&
              selectedPlan &&
              duration > selectedPlan.duration && (
                <div className="flex justify-between">
                  <span>超时费用</span>
                  <span>
                    $
                    {(duration - selectedPlan.duration) *
                      (customOvertimeRate ||
                        selectedPlan.overtimeChargePerHalfHour * 2)}
                    {customOvertimeRate && (
                      <span className="text-sm text-gray-500">
                        {" "}
                        (自定义费率)
                      </span>
                    )}
                  </span>
                </div>
              )}
            <div className="flex justify-between">
              <span>交通费用 ({selectedLocation.label})</span>
              <span>${selectedLocation.price}</span>
            </div>
            {additionalItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name || "未命名项目"}</span>
                <span>${item.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold text-xl">
              <span>总计</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
